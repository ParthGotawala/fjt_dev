// (function () {
//   'use strict';

//   angular
//     .module('app.resetpassword')
//     .controller('ResetPasswordController', ResetPasswordController);

//   /** @ngInject */
//   function ResetPasswordController(CORE, $scope, $rootScope, $stateParams, $timeout, BaseService, UserFactory, $state, DialogFactory, DASHBOARD) {
//     const vm = this;
//     vm.CORE_MESSAGE_CONSTANT = CORE.MESSAGE_CONSTANT;
//     vm.UserPasswordPattern = CORE.UserPasswordPattern;
//     let forGotPasswordToken = $stateParams.forGotPasswordToken;
//     let userID = null;
    
//     vm.BackToLogin = () => {
//       console.log("logout from BackToLogin");
//       $state.go(CORE.LOGIN_STATE);
//     };
//     vm.isDisabledSave = false;

//     let getUserIDByToken = () => {
//       vm.cgBusyLoading = UserFactory.getUserDetailsByPasswordToken().save({ forGotPasswordToken: forGotPasswordToken })
//         .$promise.then((res) => {
//           if (res && res.status == CORE.ApiResponseTypeStatus.SUCCESS && res.data) {
//             if (BaseService.loginUser) {
//               var model = {
//                 messageContent: {},
//               };
//               if (BaseService.loginUser.userid == res.data.id) {  /* if same user login then redirect to dashboard */
//                 model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.USER_ALREADY_LOGIN);                  
//                 DialogFactory.messageAlertDialog(model);
//                 $state.go(DASHBOARD.DASHBOARD_STATE);
//                 return;
//               }
//               else {
//                 model.messageContent = angular.copy(CORE.MESSAGE_CONSTANT.DYNAMIC_MESSAGE.MASTER.SIGN_OUT_FIRST);                  
//                 DialogFactory.messageAlertDialog(model);
//                 $state.go(DASHBOARD.DASHBOARD_STATE);
//                 return;
//               }
//             }
//             userID = res.data.id;
//           }
//           else {
//             console.log("logout from getUserIDByToken");
//             BaseService.loginUser ? $state.go(DASHBOARD.DASHBOARD_STATE) : $state.go(CORE.LOGIN_STATE);
//           }
//         }).catch((error) => {
//           return BaseService.getErrorLog(error);
//         });
//     }

//     if (forGotPasswordToken) {
//       getUserIDByToken(forGotPasswordToken);
//     }
//     else {
//       vm.BackToLogin();
//     }
//     //user password will reset and will be logout from other devices where user logged in
//     vm.resetPassword = () => {
//       vm.isDisabledSave = true;
//       if (BaseService.focusRequiredField(vm.resetPasswordForm)) {
//         $timeout(() => {
//           vm.isDisabledSave = false;
//         });
//         //$mdDialog.hide();
//         return;
//       }

//       let password = encryptAES(vm.user.password);
//       let passwordConfirmation = encryptAES(vm.user.passwordConfirmation);
//       if (password && passwordConfirmation) {
//         let userObj = {
//           userID: userID,
//           password: password.toString(),
//           passwordConfirmation: passwordConfirmation.toString()
//         };
//         BaseService.setLoginUserChangeDetail(true);
//         vm.cgBusyLoading = UserFactory.resetUserCredential().save(userObj).$promise.then((res) => {
//           vm.isDisabledSave = false;
//           if (res && res.data && res.data.updatedUserID) {
//             vm.user.password = null;
//             vm.user.passwordConfirmation = null;
//             $timeout(() => {
//               vm.BackToLogin();
//             }, _configTimeout);
//           }
//         }).catch((error) => {
//           return BaseService.getErrorLog(error);
//         });
//       }
//       else {
//         vm.resetPasswordForm.$setPristine();
//         return;
//       }
//     }

//     //close popup on page destroy 
//     $scope.$on('$destroy', function () {
//       BaseService.setLoginUserChangeDetail(false);
//     });
//   }
// })();
