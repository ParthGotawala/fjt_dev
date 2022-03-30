//(function () {
//  'use strict';

//  angular
//    .module('app.forgotpassword')
//    .controller('ForgotPasswordController', ForgotPasswordController);

//  /** @ngInject */
//  function ForgotPasswordController($q, $rootScope, $scope, $state, $stateParams, CORE, DASHBOARD, BaseService, DialogFactory, UserFactory, $timeout) {
//    if (BaseService.loginUser) {
//      $state.go(DASHBOARD.DASHBOARD_STATE);
//      return;
//    }
//    const vm = this;
//    vm.user = {};
//    vm.isBackToLoginPage = false;
//    vm.isDisabledSave = false;
//    vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
//    vm.message = CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.RESET_PASSWORD.message;
//    $rootScope.pageTitle = 'Forgot Password';
//    vm.title = 'Forgot Password?';
//    vm.forgotPassword = () => {
//      vm.isDisabledSave = true;
//      if (BaseService.focusRequiredField(vm.forgotPassForm)) {
//        $timeout(() => {
//          vm.isDisabledSave = false;
//        });
//        return;
//      }

//      angular.element(document).ready(() => {
//        setFocusByName('username');
//      });

//      const encryptedUsername = encryptAES(vm.user.username);
//      if (!vm.user.username) {
//        const messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.GLOBAL.USER_NAME_EMPTY);
//        const model = {
//          messageContent: messageContent,
//          multiple: true
//        };
//        DialogFactory.messageAlertDialog(model);
//        vm.isDisabledSave = false;
//        return;
//      }
//      vm.cgBusyLoading = UserFactory.forgotUserPassword().save({ userName: encryptedUsername.toString() }).$promise.then((res) => {
//        if (res.alretCallbackFn) {
//          result.alretCallbackFn.then((yes) => {
//            if (yes) {
//              setFocusByName('username');
//            }
//          });
//        }
//        if (res && res.data && res.status === CORE.ApiResponseTypeStatus.SUCCESS) {
//          if (res.data.type && res.data.type === 1) {
//            vm.title = 'Check your email.';
//          } else {
//            vm.title = 'Please contact Administrator for password.';
//          }
//          vm.message = res.userMessage.message;
//          vm.isDisabledSave = false;
//          vm.isBackToLoginPage = true;
//        } else {
//          vm.isDisabledSave = false;
//        }
//      }).catch((error) => {
//        vm.isDisabledSave = false;
//        return BaseService.getErrorLog(error);
//      });
//    };
//    vm.BackToLogin = () => {
//      $state.go(CORE.LOGIN_STATE);
//    };
//    vm.resetPassword = () => {
//      $state.go(CORE.RESET_PASSWORD_STATE);
//    };
//  }
//})();
